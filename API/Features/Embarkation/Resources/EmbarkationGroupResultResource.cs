using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Embarkation {

    public class EmbarkationMainResultResource<T> {

        public int TotalPersons { get; set; }
        public int MissingNames { get; set; }
        public int Passengers { get; set; }
        public int Boarded { get; set; }
        public int Remaining { get; set; }

        public IEnumerable<SimpleResource> Drivers { get; set; }

        public IEnumerable<EmbarkationResource> Embarkation { get; set; }

    }

}