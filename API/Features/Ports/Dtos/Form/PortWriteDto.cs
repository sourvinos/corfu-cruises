﻿namespace API.Features.Ports {

    public class PortWriteDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}