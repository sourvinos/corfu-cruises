using System;

namespace BlueWaterCruises.Infrastructure.Extensions {

    public static class DateConversions {

        public static string DateTimeToISOString(DateTime date) {
            string day = "0" + date.Day.ToString();
            string month = "0" + date.Month.ToString();
            return date.Year.ToString() + "-" + month.Substring(month.Length - 2, 2) + "-" + day.Substring(day.Length - 2, 2);
        }

    }

}

