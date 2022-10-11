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

  it('should not initialize telemetry player config if context not available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not initialize telemetry player config if context does not have pdata', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      context: {channel: 'test_channelid'},
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not initialize telemetry player config if context does not have channel', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      context: {pdata: {id: 'in.ekstep'}},
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not raise start telemetry event if mandatoy fields not available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      context: {pdata: {id: 'in.ekstep'}},
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    service.start(12);
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not raise end telemetry event if mandatoy fields not available', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    service.end(10, 5, 10, 5, false);
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not raise interact telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    service.interact('pageId', 1);
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not raise heartBeat telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    service.heartBeat({});
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not raise impression telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    service.impression(1);
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should not raise error telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize({
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    });
    service.error({}, { err: '', errtype: '' });
    expect(CsTelemetryModule.instance.isInitialised).toBeFalsy();
  });

  it('should initialize player config', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    expect(CsTelemetryModule.instance.isInitialised).toBeTruthy();
  });

  it('should raise start telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseStartTelemetry');
    service.start(12);
    expect(CsTelemetryModule.instance.isInitialised).toBeTruthy();
    expect(CsTelemetryModule.instance.telemetryService.raiseStartTelemetry).toHaveBeenCalled();
  });

  it('should raise end telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseEndTelemetry');
    service.end(10, 5, 10, 5, false);
    expect(CsTelemetryModule.instance.telemetryService.raiseEndTelemetry).toHaveBeenCalled();
  });

  it('should raise interact telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseInteractTelemetry');
    service.interact('pageId', 1);
    expect(CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry).toHaveBeenCalled();
  });

  it('should raise heartBeat telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    spyOn(CsTelemetryModule.instance.playerTelemetryService, 'onHeartBeatEvent');
    service.heartBeat({});
    expect(CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent).toHaveBeenCalled();
  });

  it('should raise impression telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseImpressionTelemetry');
    service.impression(1);
    expect(CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry).toHaveBeenCalled();
  });

  it('should raise error telemetry event', () => {
    const service = TestBed.inject(SunbirdPdfPlayerService);
    service.initialize(mockData.playerConfig);
    spyOn(CsTelemetryModule.instance.telemetryService, 'raiseErrorTelemetry');
    service.error({}, { err: '', errtype: '' });
    expect(CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry).toHaveBeenCalled();
  });



});
