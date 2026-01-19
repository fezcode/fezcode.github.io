// Data for the Learn Section
export const theoryChapters = [
    {
      id: 'basics',
      title: 'The Basics of Color',
      subtitle: 'Understanding Hue, Saturation, and Lightness',
      content: (
        <div className="space-y-4">
          <p>
            Color is not just a visual sensation but a property of light. In digital design, we often use the <strong>HSL</strong> model because it aligns with how humans perceive color.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>Hue (H):</strong> The "color" itself (e.g., red, blue, green). Measured in degrees (0-360°) on the color wheel.</li>
            <li><strong>Saturation (S):</strong> The intensity or purity of the color. 100% is vibrant; 0% is grayscale.</li>
            <li><strong>Lightness (L):</strong> How bright or dark the color is. 0% is black, 100% is white, and 50% is the "pure" color.</li>
          </ul>
        </div>
      )
    },
    {
        id: 'mixing',
        title: 'Mixing Models',
        subtitle: 'Additive (RGB) vs. Subtractive (CMYK)',
        content: (
            <div className="space-y-4">
                <p>Depending on whether you are working with light (screens) or pigment (print), color mixing works differently.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-black/5 shadow-sm">
                        <h4 className="font-bold text-lg mb-2 text-red-600">Additive (RGB)</h4>
                        <p className="text-sm mb-2">Used for Screens.</p>
                        <p className="text-sm text-gray-600">
                            Start with black. Add Red, Green, and Blue light. <br/>
                            <span className="font-bold">Result:</span> Adding all three makes White.
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-2 border-black/5 shadow-sm">
                        <h4 className="font-bold text-lg mb-2 text-cyan-600">Subtractive (CMYK)</h4>
                        <p className="text-sm mb-2">Used for Print.</p>
                        <p className="text-sm text-gray-600">
                            Start with white paper. Add Cyan, Magenta, Yellow ink.<br/>
                            <span className="font-bold">Result:</span> Adding all three makes Black (muddy dark brown).
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'psychology',
        title: 'Color Psychology',
        subtitle: 'Emotional Impact of Color',
        content: (
            <div className="space-y-4">
                <p>Colors evoke emotions and associations. While cultural context matters, some universal effects exist.</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-red-500"/> <span>Passion, Danger, Excitement</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-blue-500"/> <span>Trust, Calm, Professionalism</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-yellow-400"/> <span>Happiness, Caution, Warmth</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-green-500"/> <span>Nature, Growth, Money</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-purple-500"/> <span>Luxury, Creativity, Mystery</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-gray-500"/> <span>Balance, Neutrality, Tech</span></div>
                </div>
            </div>
        )
    }
];
