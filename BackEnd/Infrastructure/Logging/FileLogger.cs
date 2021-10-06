using System;
using System.IO;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises {

    public class FileLogger : ILogger {

        protected readonly FileLoggerProvider _fileLoggerProvider;

        public FileLogger(FileLoggerProvider fileLoggerProvider) {
            _fileLoggerProvider = fileLoggerProvider;
        }

        public IDisposable BeginScope<TState>(TState state) {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel) {
            return logLevel != LogLevel.None;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter) {

            if (!IsEnabled(logLevel)) {
                return;
            };

            if (eventId == 10000 || eventId == 20102) {
                // 10000: "Microsoft.EntityFrameworkCore.Update.SaveChangesFailed"
                // 20102: "Microsoft.EntityFrameworkCore.Database.Command.CommandError"
                return;
            }

            var fullPathName = string.Format("{0}/{1}", _fileLoggerProvider.Options.FolderPath + Path.DirectorySeparatorChar, _fileLoggerProvider.Options.FilePath.Replace("{date}", DateTime.Now.ToString("yyyy-MM-dd")));
            var logEntry = string.Format("{0} [{1}] {2} {3}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), logLevel.ToString(), formatter(state, exception), (exception != null ? "OOPS!" + exception : ""));

            using (var streamWriter = new StreamWriter(fullPathName, true)) {
                streamWriter.WriteLine(logEntry);
            }

        }

    }

}