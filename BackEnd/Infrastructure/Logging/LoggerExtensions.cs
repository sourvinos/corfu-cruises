using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises {

    public static class LoggerExtensions {

        #region Public methods

        public static ILoggingBuilder FileLogger(this ILoggingBuilder builder, Action<FileLoggerOptions> configure) {
            builder.Services.AddSingleton<ILoggerProvider, FileLoggerProvider>();
            builder.Services.Configure(configure);
            return builder;
        }

        public static void LogArrayException(int id, ILogger logger, ControllerContext context, List<Object> records, Exception exception) {
            if (exception is DbUpdateException) {
                foreach (var record in records) {
                    LogDatabaseError(record, logger, context, exception);
                }
                return;
            }
        }

        public static void LogException(int id, ILogger logger, ControllerContext context, Object record, Exception exception) {
            if (record == null) {
                LogRecordNotFound(id, logger, context);
                return;
            }
            if (exception == null) {
                LogInvalidModel(record, logger, context);
                return;
            }
            if (exception is DbUpdateException) {
                LogDatabaseError(record, logger, context, exception);
                return;
            }
            if (exception is IOException) {
                LogIOError(record, logger, context, exception);
                return;
            }
            if (exception is System.Exception) {
                LogSystemError(record, logger, context, exception.Message);
                return;
            }

        }

        public static void LogException(string id, ILogger logger, ControllerContext context, Object record, Exception exception) {
            if (record == null) {
                LogRecordNotFound(id, logger, context);
                return;
            }
            if (exception == null) {
                LogInvalidModel(record, logger, context);
                return;
            }
            if (exception is DbUpdateException) {
                LogDatabaseError(record, logger, context, exception);
                return;
            }
        }

        public static void LogInfo(ILogger logger, ControllerContext context, Object record) {
            LogRecordSaved(record, logger, context);
        }

        #endregion

        #region Private methods

        private static String GetControllerAndActionName(ControllerContext context) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append("\t");
            sb.Append("Controller: " + (context.ActionDescriptor == null ? "Unit testing" : context.ActionDescriptor.ControllerName) + "");
            sb.AppendLine();
            sb.Append("\t");
            sb.Append("Action: " + (context.ActionDescriptor == null ? "Unit testing" : context.ActionDescriptor.ActionName) + "");
            return sb.ToString();
        }

        private static String GetObjectProperties(Object myObject) {
            var sb = new StringBuilder();
            PropertyInfo[] properties = myObject.GetType().GetProperties();
            foreach (PropertyInfo p in properties) {
                sb.AppendLine();
                sb.Append("\t");
                sb.Append(string.Format(" - {0}: {1}", p.Name, p.GetValue(myObject, null)));
            }
            return sb.ToString();
        }

        private static String GetDatabaseError(Exception exception) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append("\t");
            sb.Append("Error: " + GrabDatabaseError(exception));
            return sb.ToString();
        }

        private static String GetIOError(Exception exception) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append("\t");
            sb.Append("Error: " + exception.Message);
            return sb.ToString();
        }

        private static String GetSystemError(string message) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append("\t");
            sb.Append("Error: " + message);
            return sb.ToString();
        }

        private static String GetSimpleDescription(String description) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append("\t");
            sb.Append("Error: " + description);
            return sb.ToString();
        }

        private static void LogDatabaseError(Object record, ILogger logger, ControllerContext context, Exception exception) {
            logger.LogError("{caller} {error} {record}",
                GetControllerAndActionName(context),
                GetDatabaseError(exception),
                GetObjectProperties(record));
        }

        private static void LogIOError(Object record, ILogger logger, ControllerContext context, Exception exception) {
            logger.LogError("{caller} {error} {record}",
                GetControllerAndActionName(context),
                GetIOError(exception), "");
        }

        private static void LogSystemError(Object record, ILogger logger, ControllerContext context, string message) {
            logger.LogError("{caller} {error} {record}",
                GetControllerAndActionName(context),
                GetSystemError(message), "");
        }

        private static void LogInvalidModel(Object record, ILogger logger, ControllerContext context) {
            logger.LogError("{caller} {error} {record}",
                GetControllerAndActionName(context),
                GetSimpleDescription(ApiMessages.InvalidModel()),
                GetObjectProperties(record));
        }

        private static void LogRecordNotFound(string id, ILogger logger, ControllerContext context) {
            logger.LogError("{caller} {error}", GetControllerAndActionName(context), GetSimpleDescription($"Id {id} not found"));
        }

        private static void LogRecordNotFound(int id, ILogger logger, ControllerContext context) {
            logger.LogError("{caller} {error}", GetControllerAndActionName(context), GetSimpleDescription($"Id {id} not found"));
        }

        private static void LogRecordSaved(Object record, ILogger logger, ControllerContext context) {
            logger.LogInformation("{caller} {record}",
                GetControllerAndActionName(context),
                GetObjectProperties(record));
        }

        private static string GrabDatabaseError(Exception exception) {
            if (exception.InnerException != null) {
                return exception.InnerException.Message;
            } else {
                return exception.Message;
            }

        }

        #endregion

    }

}
