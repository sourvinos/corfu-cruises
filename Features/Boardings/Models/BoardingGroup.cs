using System.Collections.Generic;

namespace CorfuCruises {

    public class BoardingGroup {

        public int AllPersons { get; set; }
        public int BoardedPersons { get; set; }
        public int RemainingPersons { get; set; }

        public List<Booking> Boardings { get; set; }

    }

}