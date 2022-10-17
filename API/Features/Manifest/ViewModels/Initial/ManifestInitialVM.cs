using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Infrastructure.Classes;

namespace API.Features.Manifest {

    public class ManifestInitialVM {

        public string Date { get; set; }
        public SimpleEntity Destination { get; set; }
        public string Port { get; set; }
        public Ship Ship { get; set; }
        public ShipRoute ShipRoute { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}