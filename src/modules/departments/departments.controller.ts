import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateDepartmentUseCase } from './application/create-department.usecase';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Department } from './domain/department.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { LEADERSHIP_ROLES } from 'src/shared/constants/roles.constants';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUserPayload } from 'src/shared/decorators/current-user.decorator';
import { PaginationParamsDto } from 'src/shared/pagination/pagination-params.dto';
import { PaginatedResultDto } from 'src/shared/pagination/paginated-result.dto';
import { ListDepartmentsUseCase } from './application/list-departments.usecase';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
    private readonly listDepartmentsUseCase: ListDepartmentsUseCase
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created' })
  @Auth(...LEADERSHIP_ROLES)
  async create(
    @Body() data: CreateDepartmentDto,
    @CurrentUser() user: AuthUserPayload
  ): Promise<Department> {
    return this.createDepartmentUseCase.execute({
      ...data,
      churchId: user.churchId,
      userId: user.userId
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  @ApiResponse({ status: 200, description: 'List of departments' })
  @Auth()
  async list(
    @CurrentUser() user: AuthUserPayload,
    @Query() query: PaginationParamsDto
  ): Promise<PaginatedResultDto<Department>> {
    return this.listDepartmentsUseCase.execute(user.churchId, query);
  }
}
