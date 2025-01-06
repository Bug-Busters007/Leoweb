﻿namespace Leoweb.Server.Database.Models
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
        ITPBO,
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
        PBE,
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
        EBA_BMG,
        MEDTWT,
        MEDT,
        SYTAV,
        MEDTMC,
        MEDTFI,
        WRRE,
        PML,
        EPMMED
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
					Subject.SEW,
					Subject.ITP,
					Subject.NWT,
					Subject.SYTSW,
					Subject.SYTEL,
					Subject.SYTAV,
					Subject.CPR,
					Subject.ITSI,
					Subject.MEDTWT,
					Subject.MEDPR,
					Subject.INSY,
					Subject.ITPBO,
					Subject.MEDT,
					Subject.MEDTMC,
					Subject.MEDTPD,
					Subject.MEDTSM,
					Subject.MEDTFI
				};
			}
		}
		public static List<Subject> Elektronik
		{
			get
			{
				return new List<Subject>()
				{
					Subject.HE,
					Subject.FST,
					Subject.PBE,
					Subject.MTRS,
					Subject.KSN,
					Subject.LA,
					Subject.DIC,
					Subject.WRWI,
					Subject.EPMEL,
					Subject.WRRE,
					Subject.ROR
				};
			}
		}
		public static List<Subject> Medizintechnik
		{
			get
			{
				return new List<Subject>()
				{
					Subject.GME,
					Subject.BSVE,
					Subject.PMW,
					Subject.BMG,
					Subject.MGT,
					Subject.MINF,
					Subject.BSVU,
					Subject.BSVB,
					Subject.LA,
					Subject.BSV,
					Subject.WRRE,
					Subject.PML,
					Subject.EPMMED,
					Subject.WRWI
				};
			}
		}
	}
}
