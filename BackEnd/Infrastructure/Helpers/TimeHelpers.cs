using System.Text.RegularExpressions;

namespace BlueWaterCruises.Infrastructure.Helpers {

    public static class TimeHelpers {

        public static bool BeEmptyOrValidTime(string time) {
            return string.IsNullOrWhiteSpace(time) || IsValidTime(time);
        }

        public static bool BeValidTime(string time) {
            return IsValidTime(time);
        }

        private static bool IsValidTime(string time) {
            try {
                return Regex.IsMatch(time, "^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$");
            } catch (RegexMatchTimeoutException) {
                return false;
            }
        }

    }

}