using System;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;
using BlueWaterCruises.Features.Ships;

namespace BlueWaterCruises.Features.Crews {

    public class Crew {

        public int Id { get; set; }
        public int ShipId { get; set; }
        public int NationalityId { get; set; }
        public int GenderId { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime Birthdate { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public Ship Ship { get; set; }
        public Nationality Nationality { get; set; }
        public Gender Gender { get; set; }
        public AppUser User { get; set; }

    }

}