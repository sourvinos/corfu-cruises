﻿namespace API.Features.Drivers {

    public class DriverWriteDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Phones { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}