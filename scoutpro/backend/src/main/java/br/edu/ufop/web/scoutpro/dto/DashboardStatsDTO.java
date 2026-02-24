// src/main/java/br/edu/ufop/web/scoutpro/dto/DashboardStatsDTO.java
package br.edu.ufop.web.scoutpro.dto;

public class DashboardStatsDTO {
    private long totalAthletes;
    private long totalClubs;
    private long totalReports;
    private long totalScouts;

    public DashboardStatsDTO(long totalAthletes, long totalClubs, long totalReports, long totalScouts) {
        this.totalAthletes = totalAthletes;
        this.totalClubs = totalClubs;
        this.totalReports = totalReports;
        this.totalScouts = totalScouts;
    }

    // Getters
    public long getTotalAthletes() { return totalAthletes; }
    public long getTotalClubs() { return totalClubs; }
    public long getTotalReports() { return totalReports; }
    public long getTotalScouts() { return totalScouts; }
}