﻿using API.Infrastructure.Classes;

namespace API.Features.ShipOwners {

    public class ShipOwnerWriteDto : BaseEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Profession { get; set; }
        public string Address { get; set; }
        public string TaxNo { get; set; }
        public string City { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
 
    }

}