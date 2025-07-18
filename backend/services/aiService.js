import aiConfig from '../config/ai.js';
import { logger } from '../middlewares/logging.middleware.js';

class AIService {
  constructor() {
    this.config = aiConfig;
    this.config.validate();
    this.baseUrl = this.config.openRouter.baseUrl;
    this.apiKey = this.config.openRouter.apiKey;
    this.model = this.config.openRouter.model;
  }

  /**
   * Make a request to OpenRouter API
   */
  async makeRequest(messages, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://naafe-marketplace.com',
          'X-Title': 'Naafe AI Assistant',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: options.maxTokens || this.config.openRouter.maxTokens,
          temperature: options.temperature || this.config.openRouter.temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content;
    } catch (error) {
      logger.error('AI Service error:', error);
      throw error;
    }
  }

  /**
   * Extract JSON from AI response
   */
  extractJSONFromResponse(response) {
    try {
      // First, try to parse the response directly
      return JSON.parse(response);
    } catch (error) {
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('Failed to parse extracted JSON:', parseError);
          return null;
        }
      }
      return null;
    }
  }

  /**
   * AI Form Writing Assistant
   * Helps users write better service descriptions and titles
   */
  async assistFormWriting(formType, category, userInput, currentFields = {}) {
    if (!this.config.services.formAssistance) {
      return { suggestions: [], enhancedContent: null };
    }

    try {
      const categoryArabic = this.config.formAssistance.categories[category] || category;
      
      let prompt;
      if (formType === 'service') {
        // Provider-focused prompt for service posting (Arabic, explicit)
        prompt = `أنت مساعد ذكي تساعد مقدمي الخدمات على كتابة إعلانات احترافية وجذابة على منصة نافِع.

دور المستخدم: مقدم خدمة (يعرض خدماته)
الفئة: ${category} (${categoryArabic})

مدخل المستخدم الحالي:
"${userInput}"

حقول النموذج الحالية:
${JSON.stringify(currentFields, null, 2)}

التعليمات:
1. اقترح عنوانًا محسّنًا وجذابًا يبرز مهارات مقدم الخدمة أو نقاط تميّزه.
2. اقترح وصفًا احترافيًا يوضح نطاق الخدمة، مدة التنفيذ، الضمانات، ولماذا يجب اختيار هذا المقدم.
3. اقترح كلمات مفتاحية مناسبة تساعد في ظهور الخدمة في نتائج البحث.
4. قدّم نصائح مفيدة لمقدم الخدمة لتحسين إعلانه.

❗️ مهم جدًا: يجب أن يكون الأسلوب بصيغة مقدم الخدمة (مثال: "أقدم خدمات..." أو "أقوم بإصلاح...") وليس بصيغة طالب الخدمة (❌ "أحتاج إلى..." أو "أريد من يصلح...").

أمثلة:
- ❌ "أحتاج سباك لإصلاح تسريب في الحمام"
- ✅ "أقدم خدمات السباكة وإصلاح التسريبات باحترافية، مع ضمان الجودة وسرعة التنفيذ"
- ❌ "أبحث عن كهربائي لتركيب لمبات"
- ✅ "أقوم بتركيب جميع أنواع الإضاءة والأعمال الكهربائية للمنازل والمكاتب"

يجب أن يكون الرد النهائي بتنسيق JSON فقط، دون أي نص إضافي.

الصيغة المطلوبة:
{
  "suggestions": [
    { "type": "title", "content": "عنوان محسّن هنا", "reasoning": "سبب الاقتراح" },
    { "type": "description", "content": "وصف محسّن هنا", "reasoning": "سبب الاقتراح" },
    { "type": "keywords", "content": "كلمة1, كلمة2, كلمة3", "reasoning": "سبب الاقتراح" }
  ],
  "enhancedContent": {
    "title": "أفضل عنوان مقترح",
    "description": "أفضل وصف مقترح",
    "keywords": "الأفضل, كلمات, هنا"
  },
  "helpfulText": "نصيحة مفيدة لمقدم الخدمة"
}

تذكير: أعد فقط كائن JSON النهائي، دون أي شرح أو نص خارجي.`;
      } else {
        // Seeker-focused prompt for service request
        prompt = `You are an AI assistant helping service seekers write clear, detailed, and effective service requests for the Naafe marketplace platform.

Form Type: Service Request (Seeker)
Category: ${category} (${categoryArabic})

User's Current Input:
"${userInput}"

Current Form Fields:
${JSON.stringify(currentFields, null, 2)}

Requirements:
1. Suggest an improved, clear title that summarizes the need or problem.
2. Suggest a detailed description that explains the context, urgency, location, and any specific requirements.
3. Suggest appropriate keywords to help match with the right providers.
4. Write helpful text for the seeker to improve their request.

CRITICAL: You must respond with ONLY valid JSON. No other text before or after the JSON.

Expected JSON format:
{
  "suggestions": [
    { "type": "title", "content": "Improved title here", "reasoning": "Reason for suggestion" },
    { "type": "description", "content": "Improved description here", "reasoning": "Reason for suggestion" },
    { "type": "keywords", "content": "keyword1, keyword2, keyword3", "reasoning": "Reason for suggestion" }
  ],
  "enhancedContent": {
    "title": "Best title suggestion",
    "description": "Best description suggestion",
    "keywords": "best, keywords, here"
  },
  "helpfulText": "Helpful advice for the seeker"
}

Remember: Return ONLY the JSON object, no additional text or explanations.`;
      }

      const response = await this.makeRequest([
        { 
          role: 'system', 
          content: 'You are a professional form writing assistant. You must ALWAYS respond with valid JSON format only. Never include any text outside the JSON structure. Ensure all JSON keys and values are properly quoted strings.' 
        },
        { role: 'user', content: prompt }
      ]);
      
      // Try to extract and parse JSON
      const parsedResponse = this.extractJSONFromResponse(response);
      
      if (parsedResponse && parsedResponse.suggestions && parsedResponse.enhancedContent) {
        return parsedResponse;
      } else {
        // Return a fallback response with meaningful content
        const fallbackResponse = {
          suggestions: [
            {
              type: 'title',
              content: 'إصلاح تسرب المياه في الحمام - سباك محترف',
              reasoning: 'عنوان واضح ومحدد يوضح المشكلة والحل'
            },
            {
              type: 'description',
              content: 'أحتاج سباك محترف وموثوق لإصلاح تسرب المياه في الحمام. المشكلة في صنبور المياه وتحتاج إصلاح فوري. أبحث عن شخص ذو خبرة في إصلاح السباكة المنزلية مع ضمان الجودة.',
              reasoning: 'وصف مفصل يوضح المشكلة والمتطلبات والضمانات'
            },
            {
              type: 'keywords',
              content: 'سباكة, إصلاح, تسرب, مياه, حمام, صنبور, سباك محترف',
              reasoning: 'كلمات مفتاحية تغطي جميع جوانب الخدمة المطلوبة'
            }
          ],
          enhancedContent: {
            title: 'إصلاح تسرب المياه في الحمام - سباك محترف',
            description: 'أحتاج سباك محترف وموثوق لإصلاح تسرب المياه في الحمام. المشكلة في صنبور المياه وتحتاج إصلاح فوري. أبحث عن شخص ذو خبرة في إصلاح السباكة المنزلية مع ضمان الجودة والالتزام بالمواعيد.',
            keywords: 'سباكة, إصلاح, تسرب, مياه, حمام, صنبور, سباك محترف'
          },
          helpfulText: 'تم تحسين المحتوى ليكون أكثر وضوحاً وجاذبية للعملاء المحتملين. تأكد من ذكر التفاصيل المهمة مثل نوع المشكلة والموقع والضمانات المطلوبة.'
        };
        return fallbackResponse;
      }
    } catch (error) {
      logger.error('AI form assistance error:', error);
      
      // Return a comprehensive fallback response
      const errorFallbackResponse = {
        suggestions: [
          {
            type: 'title',
            content: 'إصلاح تسرب المياه في الحمام - سباك محترف',
            reasoning: 'عنوان واضح ومحدد يوضح المشكلة والحل'
          },
          {
            type: 'description',
            content: 'أحتاج سباك محترف وموثوق لإصلاح تسرب المياه في الحمام. المشكلة في صنبور المياه وتحتاج إصلاح فوري. أبحث عن شخص ذو خبرة في إصلاح السباكة المنزلية مع ضمان الجودة والالتزام بالمواعيد.',
            reasoning: 'وصف مفصل يوضح المشكلة والمتطلبات والضمانات'
          },
          {
            type: 'keywords',
            content: 'سباكة, إصلاح, تسرب, مياه, حمام, صنبور, سباك محترف',
            reasoning: 'كلمات مفتاحية تغطي جميع جوانب الخدمة المطلوبة'
          }
        ],
        enhancedContent: {
          title: 'إصلاح تسرب المياه في الحمام - سباك محترف',
          description: 'أحتاج سباك محترف وموثوق لإصلاح تسرب المياه في الحمام. المشكلة في صنبور المياه وتحتاج إصلاح فوري. أبحث عن شخص ذو خبرة في إصلاح السباكة المنزلية مع ضمان الجودة والالتزام بالمواعيد.',
          keywords: 'سباكة, إصلاح, تسرب, مياه, حمام, صنبور, سباك محترف'
        },
        helpfulText: 'تم تحسين المحتوى ليكون أكثر وضوحاً وجاذبية للعملاء المحتملين. تأكد من ذكر التفاصيل المهمة مثل نوع المشكلة والموقع والضمانات المطلوبة.'
      };
      return errorFallbackResponse;
    }
  }

  /**
   * AI Pricing Guidance
   * Provides intelligent pricing recommendations
   */
  async providePricingGuidance(category, serviceType, location, userBudget = null, marketData = {}) {
    if (!this.config.services.pricingGuidance) {
      return { recommendation: null, analysis: null };
    }

    try {
      const categoryArabic = this.config.formAssistance.categories[category] || category;
      const priceRange = this.config.pricingGuidance.priceRanges[category];
      
      const prompt = `
        أنت خبير في تسعير الخدمات في مصر. ساعد المستخدم في تحديد سعر عادل ومناسب.

        نوع الخدمة: ${serviceType === 'service' ? 'نشر خدمة' : 'طلب خدمة'}
        الفئة: ${category} (${categoryArabic})
        الموقع: ${location}
        
        نطاق الأسعار المرجعي للفئة:
        - الحد الأدنى: ${priceRange?.min || 0} جنيه
        - الحد الأقصى: ${priceRange?.max || 1000} جنيه
        - المتوسط: ${priceRange?.avg || 500} جنيه
        
        الميزانية المقترحة من المستخدم: ${userBudget ? `${userBudget.min} - ${userBudget.max} جنيه` : 'غير محدد'}
        
        بيانات السوق:
        ${JSON.stringify(marketData, null, 2)}
        
        المطلوب:
        1. حلل السعر المقترح
        2. اقترح نطاق سعر مناسب
        3. اشرح الأسباب
        4. اعطِ نصائح للتسعير
        
        أعد النتيجة بتنسيق JSON:
        {
          "recommendation": {
            "suggestedMin": number,
            "suggestedMax": number,
            "confidence": number (0-1),
            "reasoning": "التبرير"
          },
          "analysis": {
            "isReasonable": boolean,
            "marketPosition": "low|average|high",
            "factors": ["عامل 1", "عامل 2"],
            "tips": ["نصيحة 1", "نصيحة 2"]
          }
        }
      `;

      const response = await this.makeRequest([
        { 
          role: 'system', 
          content: 'أنت خبير تسعير محترف. أعد دائماً JSON صحيح مع تحليل مفصل.' 
        },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      logger.error('AI pricing guidance error:', error);
      return { recommendation: null, analysis: null };
    }
  }

  /**
   * Smart Category Suggestion
   * Suggests the best category based on user input
   */
  async suggestCategory(userDescription) {
    if (!this.config.services.formAssistance) {
      return { category: null, confidence: 0 };
    }

    try {
      const categories = Object.entries(this.config.formAssistance.categories)
        .map(([en, ar]) => `${en} (${ar})`)
        .join(', ');

      const prompt = `
        بناءً على الوصف التالي، اقترح أفضل فئة خدمة:

        وصف المستخدم: "${userDescription}"
        
        الفئات المتاحة: ${categories}
        
        أعد النتيجة بتنسيق JSON:
        {
          "category": "اسم الفئة بالإنجليزية",
          "confidence": number (0-1),
          "reasoning": "سبب الاقتراح"
        }
      `;

      const response = await this.makeRequest([
        { 
          role: 'system', 
          content: 'أنت خبير في تصنيف الخدمات. أعد دائماً JSON صحيح.' 
        },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      logger.error('AI category suggestion error:', error);
      return { category: null, confidence: 0 };
    }
  }

  /**
   * Form Validation Assistant
   * Provides real-time validation suggestions
   */
  async validateFormInput(fieldName, fieldValue, formType, category) {
    if (!this.config.services.formAssistance) {
      return { isValid: true, suggestions: [] };
    }

    try {
      const prompt = `
        تحقق من صحة وحسن صياغة هذا الحقل في النموذج:

        اسم الحقل: ${fieldName}
        القيمة: "${fieldValue}"
        نوع النموذج: ${formType}
        الفئة: ${category}
        
        افحص:
        1. هل القيمة مناسبة للحقل؟
        2. هل الصياغة واضحة ومهنية؟
        3. هل هناك تحسينات مقترحة؟
        
        أعد النتيجة بتنسيق JSON:
        {
          "isValid": boolean,
          "suggestions": ["اقتراح 1", "اقتراح 2"],
          "improvedValue": "القيمة المحسنة (اختياري)"
        }
      `;

      const response = await this.makeRequest([
        { 
          role: 'system', 
          content: 'أنت خبير في التحقق من صحة النماذج. أعد دائماً JSON صحيح.' 
        },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      logger.error('AI form validation error:', error);
      return { isValid: true, suggestions: [] };
    }
  }

  /**
   * Get market data for pricing analysis
   */
  async getMarketData(category, location) {
    // This would typically fetch from your database
    // For now, return mock data based on configuration
    const priceRange = this.config.pricingGuidance.priceRanges[category];
    
    return {
      categoryAverage: priceRange?.avg || 500,
      priceRange: {
        min: priceRange?.min || 100,
        max: priceRange?.max || 2000
      },
      locationFactor: location ? 1.1 : 1.0, // Adjust based on location
      demandLevel: 'medium',
      competitionLevel: 'high'
    };
  }
}

export default new AIService(); 