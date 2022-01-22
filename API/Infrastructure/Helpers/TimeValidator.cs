using System.Text.RegularExpressions;

namespace API.Infrastructure.Helpers {

    public static class TimeValidator {

        public static bool IsTime(string time) {
            return new Regex("^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$").IsMatch(time);
        }

    }

}