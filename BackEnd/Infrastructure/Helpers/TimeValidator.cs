using System.Text.RegularExpressions;

namespace BlueWaterCruises.Infrastructure.Helpers {

    public class TimeValidator {

        public static bool IsTime(string time) {
            return new Regex("^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$").IsMatch(time);
        }

    }

}