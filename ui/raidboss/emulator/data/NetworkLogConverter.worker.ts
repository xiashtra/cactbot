import { UnreachableCode } from '../../../../resources/not_reached';

import Encounter from './Encounter';
import LogEventHandler from './LogEventHandler';
import LineEvent from './network_log_converter/LineEvent';
import LogRepository from './network_log_converter/LogRepository';
import NetworkLogConverter from './NetworkLogConverter';

declare global {
  // Using `let` or `const` isn't allowed in declare
  // eslint-disable-next-line no-var
  var scheduler: {
    yield?: () => Promise<void>;
  } | undefined;
}

const ctx: Worker = self as unknown as Worker;

ctx.addEventListener('message', (msg) => {
  void (async () => {
    if (!(msg.data instanceof ArrayBuffer)) {
      // TODO: should this return an 'error' instead?
      ctx.postMessage({
        type: 'done',
      });
      throw new UnreachableCode();
    }

    const logConverter = new NetworkLogConverter();
    const localLogHandler = new LogEventHandler();
    const repo = new LogRepository();

    // Listen for LogEventHandler to dispatch fights and persist them
    localLogHandler.on(
      'fight',
      (day: string, zoneId: string, zoneName: string, lines: LineEvent[]) => {
        // Index the lines for this encounter
        for (let i = 0; i < lines.length; ++i) {
          const line = lines[i];
          if (!line)
            throw new UnreachableCode();
          line.index = i;
        }

        const enc = new Encounter(day, zoneId, zoneName, lines);
        enc.initialize();
        if (enc.shouldPersistFight()) {
          ctx.postMessage({
            type: 'encounter',
            encounter: enc,
            name: enc.combatantTracker?.getMainCombatantName(),
          });
        }
      },
    );

    // Convert the message manually due to memory issues with extremely large files
    const decoder = new TextDecoder('UTF-8');
    let buf: Uint8Array | undefined = new Uint8Array(msg.data);
    let nextOffset = 0;
    let lines = [];
    let lineCount = 0;
    for (
      let currentOffset = nextOffset;
      nextOffset < buf.length && nextOffset !== -1;
      currentOffset = nextOffset
    ) {
      nextOffset = buf.indexOf(0x0A, nextOffset + 1);
      const line = decoder.decode(buf.slice(currentOffset, nextOffset)).trim();
      if (line.length) {
        ++lineCount;
        lines.push(line);
      }

      if (lines.length >= 1000) {
        lines = logConverter.convertLines(lines, repo);
        localLogHandler.parseLogs(lines);
        ctx.postMessage({
          type: 'progress',
          lines: lineCount,
          bytes: nextOffset,
          totalBytes: buf.length,
        });
        lines = [];
        if (globalThis.scheduler?.yield !== undefined) {
          await globalThis.scheduler.yield();
        }
      }
    }
    if (lines.length > 0) {
      lines = logConverter.convertLines(lines, repo);
      localLogHandler.parseLogs(lines);
      lines = [];
    }
    ctx.postMessage({
      type: 'progress',
      lines: lineCount,
      bytes: buf.length,
      totalBytes: buf.length,
    });

    // Unset the buffer to free memory before passing message back to main window
    buf = undefined;

    localLogHandler.endFight();

    ctx.postMessage({
      type: 'done',
    });
  })();
});
