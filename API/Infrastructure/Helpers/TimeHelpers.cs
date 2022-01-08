using System.Text.RegularExpressions;

namespace API.Infrastructure.Helpers {

    public static class TimeHelpers {

        public static bool BeEmptyOrValidTime(string time) {
            return string.IsNullOrWhiteSpace(time) || string.IsNullOrEmpty(time) || IsValidTime(time);
        }

        public static bool BeValidTime(string time) {
            return IsValidTime(time);
        }

        private static bool IsValidTime(string time) {
            if (time == null) {
                return false;
            }
            try {
                return Regex.IsMatch(time, "^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$");
            } catch (RegexMatchTimeoutException) {
                return false;
            }
        }

    }

}