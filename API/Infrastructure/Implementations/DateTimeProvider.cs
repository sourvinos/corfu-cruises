using System;
using API.Infrastructure.Interfaces;

namespace API.Infrastructure.Implementations {

    public class DateTimeProvider : IDateTimeProvider {

        public DateTime GetCurrentTime() {
            return DateTime.Now;
        }

    }

}