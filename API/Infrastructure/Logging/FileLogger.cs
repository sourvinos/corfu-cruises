using System;
using System.IO;
using Microsoft.Extensions.Logging;

namespace API.Infrastructure.Logging {

    public class FileLogger : ILogger {

        protected readonly FileLoggerProvider fileLoggerProvider;

        public FileLogger(FileLoggerProvider fileLoggerProvider) {
            this.fileLoggerProvider = fileLoggerProvider;
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
            }

            if (eventId == 10000 || eventId == 20102) {
                // 10000: "Microsoft.EntityFrameworkCore.Update.SaveChangesFailed"
                // 20102: "Microsoft.EntityFrameworkCore.Database.Command.CommandError"
                return;
            }

            var fullPathName = string.Format("{0}/{1}", fileLoggerProvider.Options.FolderPath + Path.DirectorySeparatorChar, fileLoggerProvider.Options.FilePath.Replace("{date}", DateTime.Now.ToString("yyyy-MM-dd")));
            var logEntry = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} [{logLevel}] {exception.Message}";

            using var streamWriter = new StreamWriter(fullPathName, true);
            streamWriter.WriteLine(logEntry);

        }

    }

}