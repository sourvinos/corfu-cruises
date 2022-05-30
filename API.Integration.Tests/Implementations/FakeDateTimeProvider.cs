using System;
using API.Integration.Tests.Interfaces;

namespace API.Integration.Tests.Implementations {

    public class FakeDateTimeProviders : IDateTimeProviders {

        public DateTime GetCurrentTime() {
            return DateTime.Now;
        }

    }

}