using BlueWaterCruises.Features.Ships;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class RegistrarsConfig : IEntityTypeConfiguration<Registrar> {

        public void Configure(EntityTypeBuilder<Registrar> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.ShipId).IsRequired(true);
            entity.Property(x => x.Fullname).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Phones).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Email).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Fax).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Address).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsPrimary).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Registrars).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}