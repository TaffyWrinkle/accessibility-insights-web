// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import * as React from 'react';
import { AdHocTestkeys } from '../../common/configs/adhoc-test-keys';
import { TestMode } from '../../common/configs/test-mode';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { FeatureFlags } from '../../common/feature-flags';
import { Messages } from '../../common/messages';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { VisualizationType } from '../../common/types/visualization-type';
import { generateUID } from '../../common/uid-generator';
import { AdhocIssuesTestView } from '../../DetailsView/components/adhoc-issues-test-view';
import { ScannerUtils } from '../../injected/scanner-utils';
import { VisualizationInstanceProcessor } from '../../injected/visualization-instance-processor';

const needsReviewRuleAnalyzerConfiguration: RuleAnalyzerConfiguration = {
    rules: ['aria-input-field-name', 'color-contrast', 'th-has-data-cells', 'link-in-text-block'],
    resultProcessor: (scanner: ScannerUtils) => scanner.getFailingInstances,
    telemetryProcessor: (telemetryFactory: TelemetryDataFactory) =>
        telemetryFactory.forNeedsReviewAnalyzerScan,
    key: AdHocTestkeys.NeedsReview,
    testType: VisualizationType.NeedsReview,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
};

export const NeedsReviewAdHocVisualization: VisualizationConfiguration = {
    key: AdHocTestkeys.NeedsReview,
    testMode: TestMode.Adhoc,
    getTestView: props => (
        <AdhocIssuesTestView instancesSection={NeedsReviewInstancesSection} {...props} />
    ),
    getStoreData: data => data.adhoc.needsReview,
    enableTest: data => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Needs review',
        subtitle: (
            <>
                Sometimes automated checks identify <i>possible</i> accessibility problems that need
                to be reviewed and verified by a human. Because most accessibility problems can only
                be discovered through manual testing, we recommend an{' '}
                <a href="https://accessibilityinsights.io/docs/en/web/getstarted/assessment">
                    assessment
                </a>
                .
            </>
        ),
        enableMessage: 'Running needs review checks...',
        toggleLabel: 'Show elements needing review',
        linkToDetailsViewText: 'List view and filtering',
    },
    launchPanelDisplayOrder: 6,
    adhocToolsPanelDisplayOrder: 6,
    getAnalyzer: provider =>
        provider.createRuleAnalyzerUnifiedScanForNeedsReview(needsReviewRuleAnalyzerConfiguration),
    getIdentifier: () => AdHocTestkeys.NeedsReview,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: (selectorMap, key, warnings) => null,
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    featureFlagToEnable: FeatureFlags.needsReview,
};
