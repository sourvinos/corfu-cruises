﻿namespace API.Features.Nationalities {

    public class NationalityWriteResource {

        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}