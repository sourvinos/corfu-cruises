using System;
using System.Linq;

namespace BackEnd.UnitTests {

    public static class Helpers {

        private static readonly Random _random = new();

        public static string CreateRandomString(int length) {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length).Select(s => s[_random.Next(s.Length)]).ToArray());
        }

    }

}