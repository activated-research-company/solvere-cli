import inquirer from 'inquirer';
import PromptUI from 'inquirer/lib/ui/prompt';

interface Inquirer {
  prompt(questions: inquirer.QuestionCollection<inquirer.ListQuestion>): Promise<inquirer.ListQuestion<inquirer.Answers>> & { ui: PromptUI; };
}

export { Inquirer };
