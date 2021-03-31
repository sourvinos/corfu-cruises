using System.Collections.Generic;

namespace CorfuCruises {

    public class BoardingGroupResult<T> {

        public int AllPersons { get; set; }
        public int BoardedPersons { get; set; }
        public int RemainingPersons { get; set; }

        public List<Rsv> Boardings { get; set; }

    }

}