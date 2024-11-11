import React from 'react';
import { Plus, ClipboardList } from 'lucide-react';

const testTemplates = [
    {
        id: "basic-functionality",
        name: "Basic Functionality Test",
        required: "Required" as const,
        status: "Not Started" as const,
        result: "Not Run" as const,
        notes: `Test basic functionality including:
- Input validation
- Expected output verification
- Normal execution path
- Return value checks`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
    },
    {
        id: "edge-cases",
        name: "Edge Cases Test",
        required: "Required" as const,
        status: "Not Started" as const,
        result: "Not Run" as const,
        notes: `Test edge cases including:
- Empty inputs
- Null values
- Maximum/minimum values
- Boundary conditions
- Type validation`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
    },
    {
        id: "error-handling",
        name: "Error Handling Test",
        required: "Required" as const,
        status: "Not Started" as const,
        result: "Not Run" as const,
        notes: `Test error handling including:
- Exception handling
- Invalid input handling
- Error message verification
- Recovery mechanisms
- Resource cleanup`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
    },
    {
        id: "performance",
        name: "Performance Test",
        required: "Optional" as const,
        status: "Not Started" as const,
        result: "Not Run" as const,
        notes: `Test performance including:
- Execution time
- Memory usage
- Resource utilization
- Load handling
- Scalability checks`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
    },
    {
        id: "integration",
        name: "Integration Test",
        required: "Optional" as const,
        status: "Not Started" as const,
        result: "Not Run" as const,
        notes: `Test integration aspects including:
- Module interactions
- API compatibility
- Data flow
- Dependencies
- System integration`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
    }
];

interface TestTemplatesProps {
    onSelectTemplate: (template: any) => void;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
    };
}

const TestTemplates: React.FC<TestTemplatesProps> = ({
    onSelectTemplate,
    customization
}) => {
    return (
        <></>
        // <div className="space-y-4">
        //     <div className="flex items-center gap-2">
        //         <ClipboardList
        //             size={16}
        //             className="text-gray-400"
        //         />
        //         {/* <h3 className="text-sm font-medium" style={{ color: customization.textColor }}>
        //             Test Templates
        //         </h3> */}
        //     </div>

        //     <div className="grid grid-cols-1 gap-3">
        //         {testTemplates.map((template) => (
        //             <button
        //                 key={template.id}
        //                 onClick={() => onSelectTemplate(template)}
        //                 className="p-3 rounded-lg text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        //                 style={{
        //                     backgroundColor: `${customization.highlightColor}10`,
        //                     border: `1px solid ${customization.textColor}20`,
        //                 }}
        //             >
        //                 <div className="flex items-start justify-between">
        //                     <div>
        //                         <h4 className="font-medium mb-1" style={{ color: customization.textColor }}>
        //                             {template.name}
        //                         </h4>
        //                         <span
        //                             className="text-xs px-2 py-0.5 rounded-full"
        //                             style={{
        //                                 backgroundColor: template.required === "Required"
        //                                     ? `${customization.highlightColor}20`
        //                                     : `${customization.textColor}20`,
        //                                 color: template.required === "Required"
        //                                     ? customization.highlightColor
        //                                     : customization.textColor
        //                             }}
        //                         >
        //                             {template.required}
        //                         </span>
        //                     </div>
        //                     <Plus
        //                         size={16}
        //                         className="mt-1"
        //                         style={{ color: customization.highlightColor }}
        //                     />
        //                 </div>

        //                 <p
        //                     className="mt-2 text-sm whitespace-pre-line"
        //                     style={{ color: `${customization.textColor}80` }}
        //                 >
        //                     {template.notes}
        //                 </p>
        //             </button>
        //         ))}
        //     </div>
        // </div>
    );
};

export default TestTemplates;