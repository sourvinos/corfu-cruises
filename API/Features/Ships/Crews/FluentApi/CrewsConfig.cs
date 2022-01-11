using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.Ships.Crews {

    internal class CrewsConfig : IEntityTypeConfiguration<Crew> {

        public void Configure(EntityTypeBuilder<Crew> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.GenderId).IsRequired(true);
            entity.Property(x => x.NationalityId).IsRequired(true);
            entity.Property(x => x.ShipId).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Lastname).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Firstname).HasMaxLength(128).IsRequired(true);
            entity.Property(p => p.Birthdate).HasColumnType("date").IsRequired(true);
            entity.Property(x => x.IsActive);
            // FK Constraints
            entity.HasOne(x => x.Gender).WithMany(x => x.Crews).HasForeignKey(x => x.GenderId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Nationality).WithMany(x => x.Crews).HasForeignKey(x => x.NationalityId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Ship).WithMany(x => x.Crews).HasForeignKey(x => x.ShipId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Crews).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}