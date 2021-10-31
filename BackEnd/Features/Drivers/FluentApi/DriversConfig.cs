using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.Features.Drivers {

    internal class DriversConfig : IEntityTypeConfiguration<Driver> {

        public void Configure(EntityTypeBuilder<Driver> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Phones).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Drivers).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}