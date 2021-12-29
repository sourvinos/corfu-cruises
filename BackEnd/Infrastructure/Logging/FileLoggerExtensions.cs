using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using BlueWaterCruises.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises.Infrastructure.Logging {

    public static class FileLoggerExtensions {

        #region Public methods

        public static ILoggingBuilder FileLogger(this ILoggingBuilder builder, Action<FileLoggerOptions> configure) {
            builder.Services.AddSingleton<ILoggerProvider, FileLoggerProvider>();
            builder.Services.Configure(configure);
            return builder;
        }

        public static void LogArrayException(this ILogger logger, ControllerContext context, List<Object> records, Exception exception) {
            if (exception is DbUpdateException) {
                foreach (var record in records) {
                    LogDatabaseError(record, logger, context, exception);
                }
            }
        }

        public static void LogExceptions(this int id, ILogger logger, ControllerContext context, Object record, Exception exception) {
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
                LogIOError(logger, context, exception);
                return;
            }
            if (exception is not null) {
                LogSystemError(logger, context, exception.Message);
                return;
            }

        }

        public static void LogException(this ILogger logger, ControllerContext context, Object record, Exception exception) {
            if (exception == null) {
                LogInvalidModel(record, logger, context);
            } else {
                LogDatabaseError(record, logger, context, exception);
            }
        }

        public static void LogInfo(this ILogger logger, ControllerContext context, Object record) {
            LogRecordSaved(record, logger, context);
        }

        #endregion

        #region Private methods

        private static string GetControllerAndActionName(ControllerContext context) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append('\t');
            sb.Append("Controller: ").Append(context.ActionDescriptor == null ? "Unit testing" : context.ActionDescriptor.ControllerName).Append("");
            sb.AppendLine();
            sb.Append('\t');
            sb.Append("Action: ").Append(context.ActionDescriptor == null ? "Unit testing" : context.ActionDescriptor.ActionName).Append("");
            return sb.ToString();
        }

        private static string GetObjectProperties(Object myObject) {
            if (myObject != null) {
                var sb = new StringBuilder();
                PropertyInfo[] properties = myObject.GetType().GetProperties();
                foreach (PropertyInfo p in properties) {
                    sb.AppendLine();
                    sb.Append('\t');
                    sb.AppendFormat(" - {0}: {1}", p.Name, p.GetValue(myObject, null));
                }
                return sb.ToString();
            }
            return "";
        }

        private static String GetDatabaseError(Exception exception) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append('\t');
            sb.Append("Error: ").Append(GrabDatabaseError(exception));
            return sb.ToString();
        }

        private static String GetIOError(Exception exception) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append('\t');
            sb.Append("Error: ").Append(exception.Message);
            return sb.ToString();
        }

        private static String GetSystemError(string message) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append('\t');
            sb.Append("Error: ").Append(message);
            return sb.ToString();
        }

        private static String GetSimpleDescription(String description) {
            var sb = new StringBuilder();
            sb.AppendLine();
            sb.Append('\t');
            sb.Append("Error: ").Append(description);
            return sb.ToString();
        }

        private static void LogDatabaseError(Object record, ILogger logger, ControllerContext context, Exception exception) {
            logger.LogError("{caller} {error} {record}",
                GetControllerAndActionName(context),
                GetDatabaseError(exception),
                GetObjectProperties(record));
        }

        private static void LogIOError(ILogger logger, ControllerContext context, Exception exception) {
            logger.LogError("{caller} {error} {record}",
                GetControllerAndActionName(context),
                GetIOError(exception), "");
        }

        private static void LogSystemError(ILogger logger, ControllerContext context, string message) {
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

        // private static void LogRecordNotFound(string id, ILogger logger, ControllerContext context) {
        //     logger.LogError("{caller} {error}", GetControllerAndActionName(context), GetSimpleDescription($"Id {id} not found"));
        // }

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
