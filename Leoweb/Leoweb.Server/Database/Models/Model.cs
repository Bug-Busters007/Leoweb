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
        NWP,
        NSCS,
        RK,
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
		private static readonly Dictionary<string, Subject[]> branchSubjects = new Dictionary<string, Subject[]>
	    {
		    { "informatik", new[] { Subject.AM, Subject.RK, Subject.ETH, Subject.D, Subject.E, Subject.GGPGP, Subject.GGPGW, Subject.BSPM, Subject.NWC, Subject.NWP, Subject.POSEOO, Subject.POSEPR, Subject.POSETHI, Subject.SYP, Subject.WMC, Subject.DBI, Subject.BO, Subject.RW, Subject.CABS, Subject.NSCS } },
		    { "medientechnik", new[] { Subject.SEW, Subject.ITP, Subject.NWT, Subject.SYTSW, Subject.SYTEL, Subject.SYTAV, Subject.CPR, Subject.ITSI, Subject.MEDTWT, Subject.MEDPR, Subject.INSY, Subject.ITPBO, Subject.MEDT, Subject.MEDTMC, Subject.MEDTPD, Subject.MEDTSM, Subject.MEDTFI, Subject.AM, Subject.RK, Subject.ETH, Subject.D, Subject.E, Subject.GGPGP, Subject.GGPGW, Subject.BSPM, Subject.NWC, Subject.NWP } },
		    { "elektronik", new[] { Subject.AM, Subject.RK, Subject.ETH, Subject.D, Subject.E, Subject.GGPGP, Subject.GGPGW, Subject.BSPM, Subject.NWC, Subject.NWP, Subject.HE, Subject.FST, Subject.PBE, Subject.MTRS, Subject.KSN, Subject.LA, Subject.DIC, Subject.WRWI, Subject.EPMEL, Subject.WRRE, Subject.ROR } },
		    { "medizintechnik", new[] { Subject.AM, Subject.RK, Subject.ETH, Subject.D, Subject.E, Subject.GGPGP, Subject.GGPGW, Subject.BSPM, Subject.NWC, Subject.NWP, Subject.GME, Subject.BSVE, Subject.PMW, Subject.BMG, Subject.MGT, Subject.MINF, Subject.BSVU, Subject.BSVB, Subject.LA, Subject.BSV, Subject.WRRE, Subject.PML, Subject.EPMMED, Subject.WRWI } }
	    };

		public static string[] GetBranches()
		{
            return branchSubjects.Keys.ToArray();
		}

        public static Dictionary<string, Subject[]> GetDictionary()
        {
            return branchSubjects;
		}
	}
}
