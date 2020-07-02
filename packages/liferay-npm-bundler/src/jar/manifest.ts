/**
 * SPDX-FileCopyrightText: © 2017 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import project from 'liferay-npm-build-tools-common/lib/project';

const FORBIDDEN_CUSTOM_HEADERS = new Set([
	'Bundle-ManifestVersion',
	'Bundle-Name',
	'Bundle-SymbolicName',
	'Bundle-Version',
	'Manifest-Version',
	'Provide-Capability',
	'Require-Capability',
	'Tool',
	'Web-ContextPath',
]);

export default class Manifest {
	set bundleSymbolicName(bundleSymbolicName: string) {
		if (this._bundleSymbolicName) {
			throw new Error('BundleSymbolicName can only be set once');
		}

		this._bundleSymbolicName = bundleSymbolicName;
	}

	set bundleVersion(bundleVersion: string) {
		if (this._bundleVersion) {
			throw new Error('BundleVersion can only be set once');
		}

		this._bundleVersion = bundleVersion;
	}

	set bundleName(bundleName: string) {
		if (this._bundleName) {
			throw new Error('BundleName can only be set once');
		}

		this._bundleName = bundleName;
	}

	set webContextPath(webContextPath: string) {
		if (this._webContextPath) {
			throw new Error('WebContextPath can only be set once');
		}

		this._webContextPath = webContextPath;
	}

	addProvideCapability(key: string, value: string): void {
		if (this._provideCapabilities[key]) {
			throw new Error(`ProvideCapability[${key}] can only be set once`);
		}

		this._provideCapabilities[key] = value;
	}

	addRequireCapability(key: string, filter: string): void {
		if (this._requireCapabilities[key]) {
			throw new Error(`RequireCapability[${key}] can only be set once`);
		}

		this._requireCapabilities[key] = `filter:=${filter}`;
	}

	addCustomHeader(key: string, value: string): void {
		if (FORBIDDEN_CUSTOM_HEADERS.has(key)) {
			throw new Error(`Key ${key} cannot be used as a custom header`);
		}

		if (this._customHeaders[key]) {
			throw new Error(`CustomHeader[${key}] can only be set once`);
		}

		this._customHeaders[key] = value;
	}

	get content(): string {
		const {version} = project.versionsInfo.get('liferay-npm-bundler');

		return `Manifest-Version: 1.0
Bundle-ManifestVersion: 2
Tool: liferay-npm-bundler-${version}
${header('Bundle-SymbolicName', this._bundleSymbolicName)} 
${header('Bundle-Version', this._bundleVersion)} 
${header('Bundle-Name', this._bundleName)} 
${header('Web-ContextPath', this._webContextPath)} 
${capabilities('Provide-Capability', this._provideCapabilities)}
${capabilities('Require-Capability', this._requireCapabilities)}`;
	}

	private _bundleSymbolicName: string;
	private _bundleVersion: string;
	private _bundleName: string;
	private _webContextPath: string;
	private _provideCapabilities: object = {};
	private _requireCapabilities: object = {};
	private _customHeaders: object = {};
}

function capabilities(header: string, capabilities: object): string {
	return (
		`${header}: ` +
		Object.entries(capabilities)
			.map(([key, value]) => `${key};${value}`)
			.join(',')
	);
}

function header(key: string, value: string | undefined): string {
	return value ? `${key}: ${value}` : '';
}