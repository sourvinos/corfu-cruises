using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace BlueWaterCruises {

    class EmailValidator {

        public static bool IsValidEmail(string email) {
            try {
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper, RegexOptions.None, TimeSpan.FromMilliseconds(200));
                string DomainMapper(Match match) {
                    var idn = new IdnMapping();
                    string domainName = idn.GetAscii(match.Groups[2].Value);
                    return match.Groups[1].Value + domainName;
                }
            } catch (RegexMatchTimeoutException) {
                return false;
            } catch (ArgumentException) {
                return false;
            }
            try {
                return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            } catch (RegexMatchTimeoutException) {
                return false;
            }
        }

    }

}