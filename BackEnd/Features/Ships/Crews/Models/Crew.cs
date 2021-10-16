using System;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;

namespace BlueWaterCruises.Features.Ships {

    public class Crew {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime Birthdate { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public int ShipId { get; set; }
        public int GenderId { get; set; }
        public int NationalityId { get; set; }

        public AppUser User { get; set; }
        public Ship Ship { get; set; }
        public Gender Gender { get; set; }
        public Nationality Nationality { get; set; }

    }

}