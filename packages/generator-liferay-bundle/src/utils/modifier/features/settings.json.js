import ConfigJsonModifier from '../../ConfigJsonModifier';
import ProjectAnalyzer from '../../ProjectAnalyzer';

/**
 * A class to help modifying the settings.json file.
 */
export default class extends ConfigJsonModifier {
	/**
	 * @param {Generator} generator a Yeoman generator
	 */
	constructor(generator) {
		super(generator, new ProjectAnalyzer(generator).settingsFilePath);
	}
}