using System.Collections.Generic;

namespace CorfuCruises {

    public class BoardingMainResult<T> {

        public int AllPersons { get; set; }
        public int BoardedPersons { get; set; }
        public int RemainingPersons { get; set; }

        public List<Driver> Drivers { get; set; }

        public List<Reservation> Boardings { get; set; }

    }

}