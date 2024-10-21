import { Checkbox, Table } from "flowbite-react";
import { HiOutlineFolder, HiChartBar } from "react-icons/hi";
import {
  DuftGrid,
  DuftGridFullRow,
  DuftGridHeader,
} from "../ui-components/grid-components";
import { DuftTabset, DuftTab } from "../ui-components/tab-components";
import CardComponent from "../components/card-component";
import type { FC } from "react";

const SingleTableLayoutTester: React.FC = () => {
  return (
    <>
      <DuftTabset>
        <DuftTab
          title={<TabBadge title="Table 1" value="125" />}
          icon={HiChartBar}
        >
          <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
            <div className="mb-1 w-full">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                All products
              </h1>
            </div>
          </div>

          <div className="w-full">
            <ProductsTable />
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"></div>
        </DuftTab>
        <DuftTab title={<TabBadge title="Table 2" />} icon={HiOutlineFolder}>
          <DuftGrid>
            <DuftGridFullRow>
              <DuftGridHeader>Dashboard 2</DuftGridHeader>
            </DuftGridFullRow>
            <div className="w-full">
              <CardComponent header={"My Card"} subHeader={"Test"}>
                <ProductsTable />
              </CardComponent>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <CardComponent header={"My Card"} subHeader={"Test"}>
                My card
              </CardComponent>
            </div>
          </DuftGrid>
        </DuftTab>
      </DuftTabset>
    </>
  );
};

type TabBadgeProps = {
  title?: string;
  value?: string;
};

const TabBadge: FC<TabBadgeProps> = function ({ title, value }) {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
      {value && (
        <span className="inline-flex items-center rounded-full bg-highlight-800 px-2 py-1 text-xs font-medium text-white">
          {value}
        </span>
      )}
    </div>
  );
};

const ProductsTable: FC = function () {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>
          <span className="sr-only">Toggle selected</span>
          <Checkbox />
        </Table.HeadCell>
        <Table.HeadCell>Product Name</Table.HeadCell>
        <Table.HeadCell>Technology</Table.HeadCell>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Price</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #194556
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #623232
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #194356
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #323323
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #994856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #194256
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #623378
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #192856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #523323
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #191857
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #914856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #633293
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #924856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #123323
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #198856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #132856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #613223
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #484856
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            React JS
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #103324
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $129
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="w-4 p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Angular
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            #124859
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            $149
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3"></div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default SingleTableLayoutTester;
