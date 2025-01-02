namespace Leoweb.Server.Database.Models
{
    public enum Subject
    {
        GERMAN,
        ENGLISH,
        MATH,
        POSEOO,
        POSEPR,
        POSETHI,
        SYP,
        WMC,
        DBI,
        BO,
        RW,
        GGPGW,
        GGPGP,
        NSCS,
        RELIGION_KATH,
        RELIGION_EVG,
        RELIGION_ISLM,
        ETHIK,
        CABS,
        SEW,
        HE,
        GME
    }

    public static class Branch
    {
		public static List<Subject> Informatik {
            get
            {
                return new List<Subject>()
                { 
                    Subject.POSEOO,
                    Subject.POSEPR,
                    Subject.POSETHI, 
                    Subject.SYP,
                    Subject.WMC,
                    Subject.DBI,
                    Subject.BO,
                    Subject.RW,
                    Subject.CABS,
                    Subject.NSCS
                };
            }
        }
		public static List<Subject> Medientechnik
		{
			get
			{
				return new List<Subject>()
				{
					Subject.SEW
				};
			}
		}
		public static List<Subject> Elektronik
		{
			get
			{
				return new List<Subject>()
				{
					Subject.HE
				};
			}
		}
		public static List<Subject> Medizintechnik
		{
			get
			{
				return new List<Subject>()
				{
					Subject.GME
				};
			}
		}
	}
}
