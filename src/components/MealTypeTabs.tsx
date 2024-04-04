function mealtypetokorean(mealtype: string) {
  if (mealtype === 'breakfast') {
    return '아침';
  } else if (mealtype === 'lunch') {
    return '점심';
  } else if (mealtype === 'dinner') {
    return '저녁';
  }
}

interface MealTypeTabsProps {
  mealTypes: string[];
  selectedMealType: string;
  onSelectMealType: (mealType: string) => void;
}

const MealTypeTabs: React.FC<MealTypeTabsProps> = ({
  mealTypes,
  selectedMealType,
  onSelectMealType,
}) => {
  return (
    <div className='flex mb-4'>
      {mealTypes.map((mealType) => (
        <button
          key={mealType}
          className={`px-4 py-2 mr-2 rounded ${
            selectedMealType === mealType
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => onSelectMealType(mealType)}
        >
          {mealtypetokorean(mealType)}
        </button>
      ))}
    </div>
  );
};

export default MealTypeTabs;
