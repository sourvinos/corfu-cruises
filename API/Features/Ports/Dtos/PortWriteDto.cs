﻿using API.Infrastructure.Classes;

namespace API.Features.Ports {

    public class PortWriteDto : BaseEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public int StopOrder { get; set; }
        public bool IsActive { get; set; }
 
    }

}