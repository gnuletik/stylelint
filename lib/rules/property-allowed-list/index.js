'use strict';

const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'property-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/property-allowed-list',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;

			if (!isStandardSyntaxProperty(prop)) {
				return;
			}

			if (isCustomProperty(prop)) {
				return;
			}

			if (matchesStringOrRegExp(vendor.unprefixed(prop), primary)) {
				return;
			}

			report({
				message: messages.rejected(prop),
				node: decl,
				result,
				ruleName,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
