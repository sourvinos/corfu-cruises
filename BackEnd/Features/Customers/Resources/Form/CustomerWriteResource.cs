﻿namespace BlueWaterCruises.Features.Customers {

    public class CustomerWriteResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Profession { get; set; }
        public string Address { get; set; }
        public string Phones { get; set; }
        public string PersonInCharge { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}