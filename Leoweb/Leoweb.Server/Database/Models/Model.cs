namespace Leoweb.Server.Database.Models
{
    public enum Subject
    {
        D,
        E,
        AM,
        POSEOO,
        POSEPR,
        POSETHI,
        SYP,
        WMC,
        DBI,
        BO,
        RW,
        NWC,
        BSPM,
        DSAI,
        GGPGW,
        GGPGP,
        NSCS,
        RK,
        RELIGION_EVG,
        RI,
        ETH,
        CABS,
        SEW,
        ITP,
        VERT,
        NWT,
        ITSI,
        CPR,
        SD,
        UIUX,
        MEDPR,
        SYTSW,
        SYTEL,
        INSY,
        MEDTPD,
        MEDTSM,
        HE,
        HED,
        GME,
        FST,
        MTRS,
        SOPK,
        PBEU,
        WRWI,
        LA,
        DIC,
        ROR,
        KSN,
        EPMEL,
        MINF,
        BSV,
        MGT,
        PMW,
        BSVU,
        LAU,
        CNTNT,
        AUTO,
        UNF,
        AE,
        WEPT,
        ELD,
        KME,
        MAM,
        SPK,
        SOTE,
        BSVB,
        BSVE,
        BMG,
        RFKR,
        EBA_BMG
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
                    Subject.NSCS,
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
