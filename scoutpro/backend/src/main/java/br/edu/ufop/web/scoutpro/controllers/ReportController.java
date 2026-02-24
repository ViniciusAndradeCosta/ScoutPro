package br.edu.ufop.web.scoutpro.controllers;

import br.edu.ufop.web.scoutpro.dto.DTOs.ReportRequest;
import br.edu.ufop.web.scoutpro.dto.DTOs.ReportResponse;
import br.edu.ufop.web.scoutpro.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<ReportResponse>> listAll() {
        return ResponseEntity.ok(reportService.listAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOUT', 'ADMIN')")
    public ResponseEntity<ReportResponse> create(@RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.createReport(request));
    }

    // CORREÇÃO: Endpoint para atualizar o status do relatório (Aprovado/Rejeitado)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ReportResponse> updateStatus(@PathVariable Long id, @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.updateReportStatus(id, request.getStatus()));
    }
}