import { executeOllamaStreaming, checkOllamaAPI } from '../ai_integration/executeOllama';

interface DocumentationResult {
  documentation: string;
  error?: string;
}

interface GenerateDocumentationOptions {
  includeExamples?: boolean;
  includeParameters?: boolean;
  includeReturns?: boolean;
  style?: 'google' | 'numpy' | 'sphinx';
  maxLength?: number;
}

export class DocumentationGenerator {
  private static formatPrompt(code: string, options: GenerateDocumentationOptions = {}): string {
    const styleGuide = options.style ? `Use ${options.style} documentation style.` : '';
    const requirements = [
      options.includeExamples ? 'Include usage examples.' : '',
      options.includeParameters ? 'Include detailed parameter descriptions.' : '',
      options.includeReturns ? 'Include return value descriptions.' : '',
      options.maxLength ? `Keep documentation under ${options.maxLength} words.` : ''
    ].filter(Boolean).join(' ');

    return `Generate comprehensive Python documentation for the following code. ${styleGuide} ${requirements}\n\nCode:\n${code}`;
  }
private static cleanDocumentation(rawResponse: string): string {
    // First try to parse as JSON
    try {
        const jsonObj = JSON.parse(rawResponse);
        
        // If it has a description field, return that
        console.log("obj",jsonObj )
        let obj = jsonObj
        if (jsonObj.description) {
            console.log("obj",jsonObj )
            obj =  jsonObj.description;
             console.log("ret",obj)
        }
        
        // Fallback to documentation field if present
        if (jsonObj.documentation) {
            obj =  jsonObj.documentation;
        }

        // If it's JSON but doesn't have expected fields, 
        // convert the whole object to a readable string
        console.log("ret",obj)
        return JSON.stringify(obj , null, 2);

    } catch {
        // If not JSON, clean up the text response
        let cleaned = rawResponse
            .replace(/```python\n?|```\n?/g, '')
            .replace(/^\s*Documentation:\s*/i, '')
            .replace(/^\s*Here's the documentation:\s*/i, '')
            .trim();

        return cleaned;
    }
}

  public static async generate(
    code: string,
    options: GenerateDocumentationOptions = {}
  ): Promise<DocumentationResult> {
    try {
      const isApiAccessible = await checkOllamaAPI();
      if (!isApiAccessible) {
        throw new Error('Ollama API is not accessible. Please ensure Ollama is running.');
      }

      let generatedDoc = '';
      let isComplete = false;

      await executeOllamaStreaming(
        this.formatPrompt(code, options),
        // Token callback
        (token: string) => {
          generatedDoc += token;
        },
        // Completion callback
        (fullResponse: string) => {
          generatedDoc = this.cleanDocumentation(fullResponse);
          isComplete = true;
        },
        // Error callback
        (error: any) => {
          throw error;
        }
      );

      // Wait for completion
      let attempts = 0;
      while (!isComplete && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      return {
        documentation: generatedDoc
      };

    } catch (error) {
      return {
        documentation: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  public static async generateDocstring(
    code: string,
    options: GenerateDocumentationOptions = {}
  ): Promise<DocumentationResult> {
    // Specific prompt for docstring generation
    const docstringPrompt = `Make a summary of the python code ${code}`;

    try {
      const isApiAccessible = await checkOllamaAPI();
      if (!isApiAccessible) {
        throw new Error('Ollama API is not accessible. Please ensure Ollama is running.');
      }

      let generatedDocstring = '';
      let isComplete = false;

      await executeOllamaStreaming(
        docstringPrompt,
        (token: string) => {
          generatedDocstring += token;
        },
        (fullResponse: string) => {
          generatedDocstring = this.cleanDocumentation(fullResponse);
          console.log("output",generatedDocstring)
          isComplete = true;
        },
        (error:any) => {
          throw error;
        }
      );

      // Wait for completion
      let attempts = 0;
      while (!isComplete && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      return {
        documentation: generatedDocstring
      };

    } catch (error) {
      return {
        documentation: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
}

// Export types for external use
export type { DocumentationResult, GenerateDocumentationOptions };