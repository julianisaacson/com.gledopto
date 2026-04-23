'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

class TuyaPowerSwitch extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        getOpts: { pollInterval: 60 * 60 },
      });
    }

    if (this.hasCapability('measure_power')) {
      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT);
    }

    if (this.hasCapability('measure_voltage')) {
      this.registerCapability('measure_voltage', CLUSTER.ELECTRICAL_MEASUREMENT);
    }

    if (this.hasCapability('measure_current')) {
      this.registerCapability('measure_current', CLUSTER.ELECTRICAL_MEASUREMENT);
    }

    if (this.hasCapability('meter_power')) {
      this.registerCapability('meter_power', CLUSTER.METERING);
    }

    await this._initMeasurementFactors(zclNode);
  }

  async _initMeasurementFactors(zclNode) {
    try {
      const electricalEndpoint = this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT);
      if (electricalEndpoint) {
        const electricalCluster = zclNode.endpoints[electricalEndpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME];
        const {
          acPowerMultiplier,
          acPowerDivisor,
          acCurrentMultiplier,
          acCurrentDivisor,
          acVoltageMultiplier,
          acVoltageDivisor,
        } = await electricalCluster.readAttributes(
          'acPowerMultiplier',
          'acPowerDivisor',
          'acCurrentMultiplier',
          'acCurrentDivisor',
          'acVoltageMultiplier',
          'acVoltageDivisor',
        );

        this.activePowerFactor = this._safeDivide(acPowerMultiplier, acPowerDivisor);
        this.acCurrentFactor = this._safeDivide(acCurrentMultiplier, acCurrentDivisor);
        this.acVoltageFactor = this._safeDivide(acVoltageMultiplier, acVoltageDivisor);
      }
    } catch (error) {
      this.log('Failed to read electrical measurement multipliers/divisors', error.message);
    }

    try {
      const meteringEndpoint = this.getClusterEndpoint(CLUSTER.METERING);
      if (meteringEndpoint) {
        const meteringCluster = zclNode.endpoints[meteringEndpoint].clusters[CLUSTER.METERING.NAME];
        const { multiplier, divisor } = await meteringCluster.readAttributes('multiplier', 'divisor');
        this.meteringFactor = this._safeDivide(multiplier, divisor);
      }
    } catch (error) {
      this.log('Failed to read metering multipliers/divisors', error.message);
    }
  }

  _safeDivide(multiplier, divisor) {
    if (typeof multiplier !== 'number' || typeof divisor !== 'number' || divisor === 0) {
      return 1;
    }

    return multiplier / divisor;
  }
}

module.exports = TuyaPowerSwitch;
