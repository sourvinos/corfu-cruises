using System;

namespace API.Infrastructure.Interfaces {

    public interface IDateTimeProvider {

        DateTime GetCurrentTime();

    }

}