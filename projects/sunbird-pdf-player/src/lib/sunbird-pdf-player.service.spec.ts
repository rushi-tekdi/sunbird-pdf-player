import { TestBed } from '@angular/core/testing';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { SunbirdPdfPlayerService } from './sunbird-pdf-player.service';
import { mockData } from '../lib/services/viewer.service.spec.data';

describe('SunbirdPdfPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    expect(service).toBeTruthy();
  });

  it('should initialize player config if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    expect(CsTelemetryModule.instance.isInitialised).toBeTruthy();
  });

  it('should raise START telemetry event if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseStartTelemetry');
    service.start(12);
    expect(CsTelemetryModule.instance.isInitialised).toBeTruthy();
    expect(CsTelemetryModule.instance.telemetryService.raiseStartTelemetry).toHaveBeenCalled();
  });

  it('should raise END telemetry event if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseEndTelemetry');
    service.end(10, 5, 10, 5, false);
    expect(CsTelemetryModule.instance.telemetryService.raiseEndTelemetry).toHaveBeenCalled();
  });

  it('should raise INTERACT telemetry event if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseInteractTelemetry');
    service.interact('pageId', 1);
    expect(CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry).toHaveBeenCalled();
  });

  it('should raise HEARTBEAT telemetry event if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    spyOn(CsTelemetryModule.instance.playerTelemetryService, 'onHeartBeatEvent');
    service.heartBeat({});
    expect(CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent).toHaveBeenCalled();
  });

  it('should raise IMPRESSION telemetry event if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseImpressionTelemetry');
    service.impression(1);
    expect(CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry).toHaveBeenCalled();
  });

  it('should raise ERROR telemetry event if mandatory fields are available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.optionalPlayerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseErrorTelemetry');
    service.error({}, { err: '', errtype: '' });
    expect(CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry).toHaveBeenCalled();
  });
});
