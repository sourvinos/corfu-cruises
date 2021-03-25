using System.Collections.Generic;

namespace CorfuCruises {

    public class BoardingGroupResultResource<T> {

        public int AllPersons { get; set; }
        public int BoardedPersons { get; set; }
        public int RemainingPersons { get; set; }

        public IEnumerable<BoardingResource> Boardings { get; set; }

    }

}